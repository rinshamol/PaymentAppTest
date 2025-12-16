## Backend

### Tech Stack
- Node.js
- Express.js
- MySQL/PostgreSQL
- AWS RDS (Database)

### API Endpoints
- GET /customers
- POST /payments
- GET /payments/:account_number

### Environment Variables
DB_HOST  
DB_USER  
DB_PASSWORD  
DB_NAME  

### CI/CD
GitHub Actions is configured to automatically build and validate the backend on every push.

### AWS EC2 Deployment (Planned)
1. Launch Ubuntu EC2 instance
2. Install Node.js, PM2, and Nginx
3. Clone backend repository
4. Configure environment variables
5. Start server using PM2
6. Connect to AWS RDS
