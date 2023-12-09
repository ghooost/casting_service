# New approach to Casting

The idea is to complete the following stages:

1. Create a simple backend prototype for Node.js. There should be no need for a database to minimize dependencies and keep the early phases of development simple. And it's supercool for tests - we can control DB state and reset it for each test.
2. Create a fully functional client. **<=== You are here.**
3. Fix and check.
4. Create a new version of the backend for AWS and DynamoDB. Possible - rewrite it in PHP + MySQL. It depends on a hosting availability.
5. Profit.
