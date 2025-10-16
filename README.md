# DevSecOps CI/CD Pipeline

## Description

A NestJS application with integrated DevSecOps CI/CD pipeline that includes comprehensive security scanning and quality gates.

## Security Pipeline Features

### 🔒 Security Scanners

- **SAST (Static Application Security Testing)**
  - SonarCloud analysis with quality gates
  - Semgrep security pattern detection

- **SCA (Software Composition Analysis)**
  - npm audit for dependency vulnerabilities
  - Trivy filesystem and dependency scanning
  - OWASP Dependency-Check with CVSS threshold

- **DAST (Dynamic Application Security Testing)**
  - OWASP ZAP baseline and full scans
  - Ephemeral environment deployment
  - Runtime vulnerability detection

### 🚫 Quality Gates

The pipeline **FAILS** if any of these conditions are met:

- npm audit finds HIGH/CRITICAL vulnerabilities
- Trivy detects HIGH/CRITICAL severity issues
- OWASP Dependency-Check finds CVSS >= 7.0
- Semgrep identifies HIGH/CRITICAL security issues
- SonarCloud quality gate fails
- OWASP ZAP finds HIGH risk vulnerabilities

### 📊 Pipeline Flow

```
PR Created
  ↓
Build & Test
  ↓
Security Scans (SAST, SCA, DAST)
  ↓
Quality Gate Check ← FAIL if vulnerabilities found
  ↓
✅ Deployment Approved / ❌ Pipeline Blocked
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Security Testing

### Local Security Scans

```bash
# npm audit
npm audit --audit-level=high

# Trivy scan
trivy fs .

# Semgrep SAST
semgrep --config=p/security-audit,p/owasp-top-ten,p/secrets .

# OWASP Dependency-Check
dependency-check.sh --project "DevSecOps-NestJS" --scan . --failOnCVSS 7
```

### DAST Testing

```bash
# Start ephemeral environment
docker-compose -f docker-compose.test.yml up -d

# Run OWASP ZAP scan
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## CI/CD Configuration

The pipeline is configured in `.github/workflows/ci.yml` and includes:

1. **Build & Test** - Compile and run unit tests
2. **Security Scans** - SAST, SCA, and DAST scanning
3. **Quality Gates** - Automatic failure on security issues
4. **Deployment** - Only proceeds if all security checks pass

## Security Reports

Security scan results are available as:

- GitHub Security tab (SARIF reports)
- SonarCloud dashboard
- OWASP Dependency-Check HTML reports
- OWASP ZAP scan reports

## License

MIT licensed.
