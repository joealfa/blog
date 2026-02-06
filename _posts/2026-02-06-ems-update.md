---
layout: post
title: "Employee Management System Update: GraphQL Gateway & Redis Caching"
date: 2026-02-06
categories: [projects, architecture]
tags: [dotnet, graphql, hotchocolate, redis, react, docker]
---

Following up on my [previous post]({% post_url 2026-01-26-ems-v2 %}), I've made significant architectural upgrades to the Employee Management System. While the initial version relied on a direct client-to-API communication model using REST, the latest update introduces a **GraphQL Gateway** pattern, improved performance with **Redis caching**, and better observability with **Seq**.

## Key Architectural Shift: The Gateway Pattern

The biggest change is the introduction of a dedicated Gateway layer between the frontend and the backend API.

### Before
The React application communicated directly with the ASP.NET Core Backend via REST endpoints using an auto-generated Axios client.

### After
I've introduced a **GraphQL Gateway** built with **HotChocolate 15**:

- **Unified Data Access:** The frontend now primarily queries a single GraphQL endpoint.
- **Microservices-Ready:** The Gateway acts as an orchestrator, currently wrapping the Backend's REST API using an NSwag-generated client.
- **Hybrid Approach:** While data operations use GraphQL, file uploads/downloads still use optimized REST endpoints proxied through the Gateway.

```
┌──────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend   │ ---> │   Gateway   │ ---> │   Backend   │
│ (Apollo Clt) │      │ (GraphQL)   │      │ (REST API)  │
└──────────────┘      └─────────────┘      └─────────────┘
                             │
                       ┌─────▼─────┐
                       │   Redis   │
                       └───────────┘
```

## Technology Stack Updates

### Gateway Layer (New)
- **HotChocolate 15**: A robust GraphQL server for .NET.
- **Redis**: Implemented for aggressive response caching with hash-based key generation.
- **Serilog + Seq**: Centralized structured logging to trace requests across services.

### Backend Improvements
- **Rate Limiting**: Added `AspNetCoreRateLimit` to protect API endpoints.
- **Security**: Enhanced JWT handling with refresh token rotation and reuse detection.

### Frontend Modernization
- **Apollo Client**: Replaced Axios for most data fetching needs.
- **GraphQL Code Generator**: Automatically generates typed hooks from queries, ensuring the frontend stays type-safe with the schema.

## Performance & Observability

With the addition of **Redis**, the Gateway caches responses from the backend, significantly reducing load on the database for frequently accessed data like reference lists (Salary Grades, Positions).

**Docker** has been introduced to the development stack to easily spin up infrastructure dependencies:
```bash
# Redis for caching
docker run -d --name redis -p 6379:6379 redis

# Seq for centralized logging
docker run -d --name seq -e ACCEPT_EULA=Y -p 5341:80 datalust/seq:latest
```

## Getting Started with the New Stack

The project structure has expanded:
- `server/`: The original REST API (Clean Architecture).
- `gateway/`: The new GraphQL layer.
- `application/`: The updated React app.

Check out the updated [repository](https://github.com/joealfa/ems-v2) to see the code in action!
