pipeline {
    agent any

    stages {
        stage('Docker Build') {
            steps {
                echo 'Building the Docker image...'
                // This single command runs your Dockerfile,
                // which handles npm install and npm build inside.
                sh 'docker build -t port-app:latest .'
            }
        }

        stage('Test') {
            // This is a good stage to add.
            // It runs your app's test command *inside* the new image
            // to make sure it's stable.
            steps {
                echo 'Running tests in the new container...'
                // This assumes you have a "test" script in your package.json
                sh 'docker run --rm port-app:latest npm test'
            }
        }

        stage('Run Docker Container') {
            steps {
                echo 'Deploying the app...'
                // Your original commands are perfect
                sh 'docker stop port-app || true'
                sh 'docker rm port-app || true'
                sh 'docker run -d -p 3000:3000 --name port-app port-app:latest'
            }
        }
    }
}