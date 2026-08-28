pipeline {
    agent any

    tools {
        nodejs 'NodeJS_24'
    }

    environment {
        DEPLOY_DIR = '/var/jenkins_home/deploy'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    rm -rf ${DEPLOY_DIR}/*
                    cp -r dist/* ${DEPLOY_DIR}/
                '''
            }
        }
    }

    post {
        success {
            echo 'Deploiement reussi. Site disponible sur le port 8081.'
        }
        failure {
            echo 'Le build ou le deploiement a echoue.'
        }
    }
}
