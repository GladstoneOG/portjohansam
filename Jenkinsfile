pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t port-app .'
            }
        }

        stage('Run Docker Container') {
            steps {
                sh 'docker stop port-app || true'
                sh 'docker rm port-app || true'
                sh 'docker run -d -p 3000:3000 --name port-app port-app'
            }
        }
    }
}
