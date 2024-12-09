# Cloud Storage System

A robust and scalable cloud storage system designed to provide secure, user-friendly, and efficient file storage and management. This system leverages modern web technologies and distributed cloud infrastructure to handle large volumes of data seamlessly, ensuring accessibility, reliability, and high performance.

---

## Features

- *Scalable Architecture*: Efficiently handles increasing volumes of data with distributed storage solutions.
- *Secure File Storage*: Implements encryption and robust authentication for data protection.
- *Distributed Storage*:
  - *HDFS* for fault-tolerant and high-throughput storage.
  - *AWS S3* for scalable, durable, and low-latency cloud storage.
- *Metadata Management*: Uses MongoDB to manage metadata and user-related information.
- *User-Friendly Interface*: A responsive and interactive web interface for easy file uploads, downloads, and management.


---

## Technology Stack

### Frontend
- *React.js*

### Backend
- *Node.js*
- *Express.js*

### Storage
- *HDFS (Hadoop Distributed File System)*
- *AWS S3*
- *MongoDB*

---

## Installation

Follow the steps below to set up the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/sanjuD1603/cloud_storage.git
cd cloud_storage

### 2. Install Dependencies

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

### 3.Configure Environment Variables
MONGO_URI=<your_mongo_connection_string>
AWS_ACCESS_KEY=<your_aws_access_key>
AWS_SECRET_KEY=<your_aws_secret_key>
S3_BUCKET_NAME=<your_s3_bucket_name>
HDFS_CONFIG=<path_to_hdfs_configuration_file>
PORT=5000

### 4.Start the Application
frontend
cd frontend
npm start

Backend
cd ../backend
npm start


Access using localhost