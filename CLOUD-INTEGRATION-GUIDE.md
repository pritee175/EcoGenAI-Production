# Cloud Integration & Onboarding - Complete Guide

## Overview

EcoGenAI transforms from a demo platform into a **persistent sustainability engine** through cloud integration. After logging in, users complete a short onboarding flow that connects EcoGenAI to their cloud infrastructure (AWS, Azure, GCP, or internal systems). Once connected, EcoGenAI continuously monitors GPU workloads in the background—even when the user is offline—calculating energy consumption and carbon emissions in real-time.

---

## User Journey

### 1. Login
- User logs in via email/password or Google OAuth
- System checks if user has completed onboarding
- **New users** → Redirect to `/onboarding`
- **Returning users with onboarding complete** → Redirect to `/dashboard`
- **Returning users without onboarding** → Redirect to `/onboarding`

### 2. Onboarding Flow (4 Steps)

#### Step 1: Welcome
- Introduction to EcoGenAI's capabilities
- Key features highlighted:
  - **Read-Only Access**: Only monitors infrastructure, never accesses AI prompts or customer data
  - **Continuous Monitoring**: Tracking continues even when user is offline
  - **Multi-Cloud Support**: Works with AWS, Azure, GCP, and internal infrastructure
- User enters organization name (optional)
- Click "Get Started" to proceed

#### Step 2: Cloud Provider Selection
- User selects where their AI is running:
  - **AWS** (Amazon Web Services)
  - **Azure** (Microsoft Azure)
  - **GCP** (Google Cloud Platform)
  - **Internal** (On-premise infrastructure)
- Each option shows what will be monitored (EC2 GPU instances, Azure VMs, GCP Compute Engine, etc.)

#### Step 3: Credentials
- User provides cloud access credentials
- **Clear privacy notice** explaining what EcoGenAI monitors:
  - ✓ GPU instance types and counts
  - ✓ Workload start/stop times
  - ✓ Cloud regions and availability zones
  - ✓ Resource utilization metrics
  - ✗ AI model prompts or responses
  - ✗ Customer data or PII
  - ✗ Model weights or training data
  - ✗ Application logs or code

**Credential Requirements by Provider:**

**AWS:**
- Access Key ID (e.g., `AKIAIOSFODNN7EXAMPLE`)
- Secret Access Key
- Regions to monitor (optional, defaults to all)

**Azure:**
- Client ID (Application ID)
- Client Secret
- Subscription ID (auto-detected)
- Regions to monitor (optional)

**GCP:**
- Service Account JSON (full JSON key file)
- Project ID (extracted from JSON)
- Regions to monitor (optional)

**Internal:**
- API Key for internal GPU cluster management system

- System verifies credentials by making test API calls
- If verification succeeds → Proceed to Step 4
- If verification fails → Show error message with details

#### Step 4: Success
- Confirmation screen showing:
  - Connected account details (provider, account ID, status)
  - What happens next:
    - EcoGenAI continuously monitors GPU workloads
    - Energy and carbon calculations happen automatically
    - Tracking continues even when user is offline
    - Dashboard updates in real-time via WebSocket
- Click "Go to Dashboard" to start using EcoGenAI

### 3. Dashboard Experience
- User sees real-time AI workload data
- Workloads detected from cloud provider appear automatically
- Energy and carbon metrics update every 5 seconds
- Historical data accumulates for ESG reporting

---

## Backend Architecture

### Database Models

#### `cloud_integrations` Table
```sql
CREATE TABLE cloud_integrations (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR NOT NULL,
    organization_name VARCHAR,
    provider VARCHAR NOT NULL,  -- aws, azure, gcp, internal
    provider_account_id VARCHAR,  -- AWS account ID, Azure subscription, GCP project
    access_key TEXT NOT NULL,  -- Encrypted in production
    secret_key TEXT,  -- Encrypted in production
    regions_to_monitor VARCHAR,
    status VARCHAR NOT NULL,  -- pending, connected, disconnected, failed
    error_message TEXT,
    last_sync_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `onboarding_status` Table
```sql
CREATE TABLE onboarding_status (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR UNIQUE NOT NULL,
    step_welcome_completed BOOLEAN DEFAULT FALSE,
    step_cloud_selection_completed BOOLEAN DEFAULT FALSE,
    step_credentials_completed BOOLEAN DEFAULT FALSE,
    step_verification_completed BOOLEAN DEFAULT FALSE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);
```

#### `ai_workloads` Table (Enhanced)
```sql
CREATE TABLE ai_workloads (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR NOT NULL,
    job_type VARCHAR NOT NULL,
    gpu_count INTEGER NOT NULL,
    cloud_region VARCHAR NOT NULL,
    cloud_instance_id VARCHAR,  -- NEW: Cloud provider instance ID
    start_time TIMESTAMP NOT NULL,
    runtime_seconds FLOAT DEFAULT 0.0,
    status VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Background Monitoring

#### Cloud Monitoring Scheduler
- Runs every **30 seconds** (configurable)
- Queries all `cloud_integrations` with `status='connected'`
- For each integration:
  1. Calls cloud provider API to detect GPU instances
  2. Checks if workload already exists (by `cloud_instance_id`)
  3. Creates new `AIWorkload` record if not exists
  4. Updates existing workload status if changed
  5. Updates `last_sync_time` on integration

#### Workload Update Scheduler
- Runs every **5 seconds**
- Updates runtime for all running workloads
- Calculates incremental energy consumption
- Calculates carbon emissions
- Broadcasts updates via WebSocket

---

## Cloud Provider Integration

### AWS Integration

**Credentials Verification:**
```python
import boto3

def verify_aws_credentials(access_key, secret_key):
    try:
        sts = boto3.client('sts',
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key
        )
        identity = sts.get_caller_identity()
        return {
            "success": True,
            "account_id": identity['Account'],
            "regions": ["us-east-1", "us-west-2", "eu-west-1", "ap-south-1"]
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
```

**Workload Detection:**
```python
def detect_aws_gpu_workloads(access_key, secret_key, regions):
    ec2 = boto3.client('ec2',
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key
    )
    
    # Query GPU instances (p3, p4, g4dn, g5 families)
    response = ec2.describe_instances(
        Filters=[
            {'Name': 'instance-state-name', 'Values': ['running']},
            {'Name': 'instance-type', 'Values': ['p3.*', 'p4.*', 'g4dn.*', 'g5.*']}
        ]
    )
    
    workloads = []
    for reservation in response['Reservations']:
        for instance in reservation['Instances']:
            workloads.append({
                "cloud_instance_id": instance['InstanceId'],
                "model_name": f"AWS-{instance['InstanceType']}",
                "gpu_count": get_gpu_count(instance['InstanceType']),
                "region": instance['Placement']['AvailabilityZone'][:-1],
                "start_time": instance['LaunchTime']
            })
    
    return workloads
```

**GPU Count Mapping:**
```python
GPU_COUNTS = {
    "p3.2xlarge": 1,    # 1x V100
    "p3.8xlarge": 4,    # 4x V100
    "p3.16xlarge": 8,   # 8x V100
    "p4d.24xlarge": 8,  # 8x A100
    "g4dn.xlarge": 1,   # 1x T4
    "g5.xlarge": 1,     # 1x A10G
    "g5.12xlarge": 4,   # 4x A10G
}
```

### Azure Integration

**Credentials Verification:**
```python
from azure.identity import ClientSecretCredential
from azure.mgmt.compute import ComputeManagementClient

def verify_azure_credentials(client_id, client_secret, tenant_id, subscription_id):
    try:
        credential = ClientSecretCredential(
            tenant_id=tenant_id,
            client_id=client_id,
            client_secret=client_secret
        )
        
        compute_client = ComputeManagementClient(credential, subscription_id)
        # Test API call
        list(compute_client.virtual_machines.list_all())
        
        return {
            "success": True,
            "subscription_id": subscription_id,
            "regions": ["eastus", "westus2", "westeurope", "southindia"]
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
```

**Workload Detection:**
```python
def detect_azure_gpu_workloads(credential, subscription_id):
    compute_client = ComputeManagementClient(credential, subscription_id)
    
    workloads = []
    for vm in compute_client.virtual_machines.list_all():
        vm_size = vm.hardware_profile.vm_size
        
        # Check if it's a GPU VM (NC, ND, NV series)
        if any(series in vm_size for series in ['NC', 'ND', 'NV']):
            workloads.append({
                "cloud_instance_id": vm.id,
                "model_name": f"Azure-{vm_size}",
                "gpu_count": get_azure_gpu_count(vm_size),
                "region": vm.location,
                "start_time": datetime.utcnow()
            })
    
    return workloads
```

### GCP Integration

**Credentials Verification:**
```python
from google.oauth2 import service_account
from googleapiclient import discovery

def verify_gcp_credentials(service_account_json):
    try:
        sa_info = json.loads(service_account_json)
        credentials = service_account.Credentials.from_service_account_info(sa_info)
        
        compute = discovery.build('compute', 'v1', credentials=credentials)
        project = sa_info['project_id']
        
        # Test API call
        compute.zones().list(project=project).execute()
        
        return {
            "success": True,
            "project_id": project,
            "regions": ["us-central1", "us-west1", "europe-west1", "asia-south1"]
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
```

**Workload Detection:**
```python
def detect_gcp_gpu_workloads(credentials, project_id):
    compute = discovery.build('compute', 'v1', credentials=credentials)
    
    workloads = []
    zones = compute.zones().list(project=project_id).execute()
    
    for zone in zones.get('items', []):
        zone_name = zone['name']
        instances = compute.instances().list(
            project=project_id,
            zone=zone_name
        ).execute()
        
        for instance in instances.get('items', []):
            guest_accelerators = instance.get('guestAccelerators', [])
            
            if guest_accelerators:
                gpu_count = sum(acc['acceleratorCount'] for acc in guest_accelerators)
                workloads.append({
                    "cloud_instance_id": instance['id'],
                    "model_name": f"GCP-{instance['name']}",
                    "gpu_count": gpu_count,
                    "region": zone_name[:-2],
                    "start_time": datetime.utcnow()
                })
    
    return workloads
```

---

## Security Considerations

### Credential Storage
**Current (Demo):** Credentials stored in plain text in database
**Production:** Must encrypt credentials using:
- **AWS KMS** (Key Management Service)
- **Azure Key Vault**
- **GCP Secret Manager**
- **HashiCorp Vault**

```python
from cryptography.fernet import Fernet

# Generate encryption key (store securely, not in code!)
key = Fernet.generate_key()
cipher = Fernet(key)

# Encrypt before storing
encrypted_access_key = cipher.encrypt(access_key.encode())

# Decrypt when using
decrypted_access_key = cipher.decrypt(encrypted_access_key).decode()
```

### IAM Permissions (Read-Only)

**AWS IAM Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeRegions",
        "cloudwatch:GetMetricStatistics",
        "sagemaker:ListTrainingJobs",
        "sagemaker:ListEndpoints"
      ],
      "Resource": "*"
    }
  ]
}
```

**Azure RBAC Role:**
- **Reader** role on subscription (read-only access to all resources)

**GCP IAM Role:**
- **Compute Viewer** (`roles/compute.viewer`)
- **Monitoring Viewer** (`roles/monitoring.viewer`)

---

## API Endpoints

### Onboarding

**GET `/api/onboarding/status/{user_email}`**
- Returns onboarding progress and completion status
- Used by login page to determine redirect

**POST `/api/onboarding/step/welcome`**
- Marks welcome step as completed

**POST `/api/onboarding/step/cloud-selection`**
- Saves selected cloud provider
- Creates `CloudIntegration` record in PENDING status

**POST `/api/onboarding/step/credentials`**
- Verifies cloud credentials
- Updates `CloudIntegration` with credentials and CONNECTED status
- Returns account details

**POST `/api/onboarding/complete`**
- Marks onboarding as fully completed
- User can now access dashboard

### Cloud Integration Management

**GET `/api/onboarding/integrations/{user_email}`**
- Returns all cloud integrations for user

**DELETE `/api/onboarding/integrations/{integration_id}`**
- Disconnects cloud integration (sets status to DISCONNECTED)
- Keeps historical data

**POST `/api/onboarding/integrations/{integration_id}/reconnect`**
- Re-verifies credentials and reconnects

---

## Testing the Feature

### 1. Start Backend
```bash
cd EcoGenAI/backend
python -m uvicorn app.main:app --reload
```

### 2. Start Frontend
```bash
cd EcoGenAI/frontend-new
npm run dev
```

### 3. Test Onboarding Flow
1. Go to `http://localhost:3000/login`
2. Sign up with new email (e.g., `test@example.com`)
3. Should redirect to `/onboarding`
4. Complete 4-step onboarding:
   - Step 1: Enter organization name, click "Get Started"
   - Step 2: Select cloud provider (e.g., AWS)
   - Step 3: Enter credentials:
     - Access Key: `AKIAIOSFODNN7EXAMPLE` (any 20+ chars)
     - Secret Key: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` (any 40+ chars)
   - Step 4: Click "Go to Dashboard"
5. Should redirect to `/dashboard`

### 4. Verify Background Monitoring
- Check backend logs for:
  ```
  ✓ Cloud monitoring started - checking cloud providers every 30 seconds
  Monitoring AWS account 123456789012...
  ```
- Workloads detected from cloud will appear in dashboard automatically

### 5. Test Returning User
1. Log out and log back in with same email
2. Should redirect directly to `/dashboard` (onboarding already complete)

---

## Production Deployment Checklist

- [ ] Encrypt cloud credentials before storing in database
- [ ] Use environment variables for encryption keys
- [ ] Implement proper IAM roles with read-only permissions
- [ ] Add rate limiting to cloud API calls (avoid hitting quotas)
- [ ] Implement exponential backoff for failed API calls
- [ ] Add monitoring/alerting for cloud integration failures
- [ ] Store audit logs for all cloud API calls
- [ ] Implement credential rotation mechanism
- [ ] Add support for multiple cloud accounts per user
- [ ] Implement workload deduplication (same instance detected multiple times)
- [ ] Add support for stopping/starting workload detection per integration
- [ ] Implement webhook notifications for new workloads detected
- [ ] Add cost estimation for cloud monitoring API calls
- [ ] Implement GDPR-compliant data retention policies
- [ ] Add support for custom cloud regions/endpoints

---

## Future Enhancements

1. **Real-Time GPU Utilization**: Query CloudWatch/Azure Monitor/GCP Monitoring for actual GPU usage percentages
2. **Cost Tracking**: Integrate with cloud billing APIs to show actual costs alongside carbon
3. **Automated Optimization**: Suggest and auto-execute workload migrations to cleaner regions
4. **Multi-Account Support**: Allow users to connect multiple AWS accounts, Azure subscriptions, etc.
5. **Kubernetes Integration**: Detect GPU workloads running in EKS, AKS, GKE clusters
6. **Slack/Teams Notifications**: Alert users when high-carbon workloads are detected
7. **Carbon Budget Alerts**: Notify when monthly carbon budget is exceeded
8. **Workload Tagging**: Allow users to tag workloads with project names, cost centers, etc.
9. **Custom Dashboards**: Let users create custom views filtered by region, project, team, etc.
10. **API Access**: Provide REST API for programmatic access to carbon data

---

## Conclusion

The cloud integration feature transforms EcoGenAI from a demo platform into a **production-ready sustainability engine**. By continuously monitoring cloud infrastructure in the background, EcoGenAI provides persistent, accurate, and audit-ready tracking of AI energy and carbon impact—without disrupting how users normally work.

This is the key differentiator that makes EcoGenAI enterprise-ready for Shark Tank and real-world deployment.

