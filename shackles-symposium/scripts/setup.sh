#!/bin/bash

################################################################################
# Shackles Symposium - Development Environment Setup Script
# This script sets up the complete development environment
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}\n"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    local missing_tools=()
    
    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version)
        print_success "Node.js $NODE_VERSION installed"
    else
        missing_tools+=("Node.js")
        print_error "Node.js is not installed"
    fi
    
    # Check npm
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_success "npm $NPM_VERSION installed"
    else
        missing_tools+=("npm")
        print_error "npm is not installed"
    fi
    
    # Check Git
    if command_exists git; then
        GIT_VERSION=$(git --version)
        print_success "$GIT_VERSION installed"
    else
        missing_tools+=("Git")
        print_error "Git is not installed"
    fi
    
    # Check Docker (optional)
    if command_exists docker; then
        DOCKER_VERSION=$(docker --version)
        print_success "$DOCKER_VERSION installed"
    else
        print_warning "Docker is not installed (optional)"
    fi
    
    # Check MongoDB (optional - can use Atlas)
    if command_exists mongod; then
        print_success "MongoDB is installed locally"
    else
        print_warning "MongoDB is not installed locally (can use MongoDB Atlas)"
    fi
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        print_info "Please install the missing tools and run this script again"
        exit 1
    fi
    
    print_success "All required prerequisites are installed!"
}

# Create .env files
setup_env_files() {
    print_header "Setting Up Environment Files"
    
    # Backend .env
    if [ ! -f "BACKEND/.env" ]; then
        print_info "Creating BACKEND/.env file..."
        cat > BACKEND/.env << EOF
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/shackles_symposium
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shackles_symposium

# Redis Cache (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=shackles-symposium-uploads

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
EOF
        print_success "Created BACKEND/.env"
    else
        print_warning "BACKEND/.env already exists, skipping..."
    fi
    
    # Frontend .env
    if [ ! -f "FRONTEND/.env" ]; then
        print_info "Creating FRONTEND/.env file..."
        cat > FRONTEND/.env << EOF
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Environment
VITE_NODE_ENV=development
EOF
        print_success "Created FRONTEND/.env"
    else
        print_warning "FRONTEND/.env already exists, skipping..."
    fi
    
    # Root .env.example
    if [ ! -f ".env.example" ]; then
        print_info "Creating .env.example file..."
        cat > .env.example << EOF
# This is an example environment file
# Copy this to .env and fill in your actual values

# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=admin123

# Redis
REDIS_PASSWORD=redis123

# Backend
BACKEND_PORT=5000
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development

# Frontend
FRONTEND_PORT=3000
VITE_API_BASE_URL=http://localhost:5000/api

# AWS
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=shackles-symposium-uploads

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EOF
        print_success "Created .env.example"
    fi
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    # Backend dependencies
    if [ -d "BACKEND" ]; then
        print_info "Installing backend dependencies..."
        cd BACKEND
        npm install
        cd ..
        print_success "Backend dependencies installed"
    fi
    
    # Frontend dependencies
    if [ -d "FRONTEND" ]; then
        print_info "Installing frontend dependencies..."
        cd FRONTEND
        npm install
        cd ..
        print_success "Frontend dependencies installed"
    fi
    
    # Test dependencies (if directory exists)
    if [ -d "tests/integration" ] && [ -f "tests/integration/package.json" ]; then
        print_info "Installing test dependencies..."
        cd tests/integration
        npm install
        cd ../..
        print_success "Test dependencies installed"
    fi
}

# Setup Git hooks
setup_git_hooks() {
    print_header "Setting Up Git Hooks"
    
    if [ -d ".git" ]; then
        print_info "Setting up pre-commit hook..."
        
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."

# Run linter on backend
if [ -d "BACKEND" ]; then
    cd BACKEND
    npm run lint --if-present || true
    cd ..
fi

# Run linter on frontend
if [ -d "FRONTEND" ]; then
    cd FRONTEND
    npm run lint --if-present || true
    cd ..
fi

echo "Pre-commit checks complete!"
EOF
        chmod +x .git/hooks/pre-commit
        print_success "Git pre-commit hook installed"
    else
        print_warning "Not a git repository, skipping git hooks setup"
    fi
}

# Create Prettier config
setup_prettier() {
    print_header "Setting Up Code Formatting"
    
    if [ ! -f ".prettierrc" ]; then
        cat > .prettierrc << EOF
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
EOF
        print_success "Created .prettierrc"
    fi
    
    if [ ! -f ".prettierignore" ]; then
        cat > .prettierignore << EOF
node_modules
dist
build
coverage
*.min.js
*.min.css
package-lock.json
EOF
        print_success "Created .prettierignore"
    fi
}

# Print next steps
print_next_steps() {
    print_header "Setup Complete!"
    
    echo -e "${GREEN}✓${NC} Environment files created"
    echo -e "${GREEN}✓${NC} Dependencies installed"
    echo -e "${GREEN}✓${NC} Git hooks configured"
    echo -e "${GREEN}✓${NC} Code formatting configured"
    
    print_header "Next Steps"
    
    echo "1. Update environment variables:"
    echo -e "   ${YELLOW}→${NC} Edit BACKEND/.env with your MongoDB URI, AWS credentials, etc."
    echo -e "   ${YELLOW}→${NC} Edit FRONTEND/.env if needed"
    echo ""
    echo "2. Start MongoDB:"
    echo -e "   ${YELLOW}→${NC} Local: mongod"
    echo -e "   ${YELLOW}→${NC} Docker: docker-compose up mongodb"
    echo -e "   ${YELLOW}→${NC} Or use MongoDB Atlas (update MONGODB_URI)"
    echo ""
    echo "3. Start the development servers:"
    echo -e "   ${YELLOW}→${NC} Backend:  cd BACKEND && npm run dev"
    echo -e "   ${YELLOW}→${NC} Frontend: cd FRONTEND && npm run dev"
    echo ""
    echo "4. Access the application:"
    echo -e "   ${YELLOW}→${NC} Frontend: http://localhost:3000"
    echo -e "   ${YELLOW}→${NC} Backend:  http://localhost:5000"
    echo ""
    echo "5. Optional - Use Docker Compose:"
    echo -e "   ${YELLOW}→${NC} cd docker && docker-compose up"
    echo ""
    print_success "Happy coding! 🎉"
}

# Main execution
main() {
    clear
    print_header "Shackles Symposium - Setup Script"
    
    check_prerequisites
    setup_env_files
    install_dependencies
    setup_git_hooks
    setup_prettier
    print_next_steps
}

# Run main function
main
