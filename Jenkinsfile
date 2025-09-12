pipeline {
    agent any

    environment {
        NODE_HOME = "/usr/local/bin"
        PATH = "${NODE_HOME}:${env.PATH}"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                echo "🧹 Cleaning old workspace..."
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                echo "🔄 Fetching latest code..."
                git branch: 'main', credentialsId: 'github-private-repo', url: 'https://github.com/deventialimited/aneuro-website.git'
            }
        }

        stage('Frontend Build & Deploy') {
            steps {
                dir('frontend') {
                    echo "📦 Installing frontend dependencies..."
                    sh 'npm install'

                    echo "⚡ Building frontend..."
                    sh 'npm run build'

                    echo "🚀 Deploying frontend to Nginx..."
                    sh '''
                       sudo mkdir -p /var/www/aneuro-website
                       sudo rm -rf /var/www/aneuro-website/*
                       sudo cp -r dist/* /var/www/aneuro-website/
                       sudo systemctl restart nginx
                    '''
                }
            }
        }

        stage('Backend Setup & Restart') {
            steps {
                dir('backend') {
                    echo "📦 Installing backend dependencies..."
                    sh 'npm install'
                    echo "🚀 Restarting backend service..."
                    sh '''
                    /usr/bin/pm2 delete aneuro-backend || true
                    /usr/bin/pm2 start npm --name "aneuro-backend" -- run dev
                    /usr/bin/pm2 save
                    '''
                    }
                }
            }
    }
    

    post {
        success {
            echo "✅ Build & deployment completed successfully!"
        }
        failure {
            echo "❌ Build failed! Check Jenkins logs."
        }
    }
}
