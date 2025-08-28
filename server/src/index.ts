import express from "express";
import cors from 'cors';

import eppPointRoutes from "./api/routes/agent/eppData.routes.ts"
import userGroupRoutes from "./api/routes/frontend/userGroup.routes.ts"
import groupRoleroutes from "./api/routes/frontend/groupRole.routes.ts"
import saveChangesRoutes from "./api/routes/frontend/saveChange.routes.ts"
import logRoutes from "./api/routes/agent/getLog.routes.ts"
import userRegistrationRoutes from './api/routes/agent/registration.routes.ts'
import userCountRoutes from './api/routes/frontend/dashboard/epCount.routes.ts'
import  complaintScoreRoutes from "./api/routes/frontend/dashboard/complaintScore.routes.ts";
import  allLogsDownloadRoutes from "./api/routes/download/allLogsDownload.routes.ts";
import userLogDownloadRoutes from "./api/routes/download/userLogDownload.routes.ts"
import registrationStatusRoutes from "./api/routes/agent/registrationStatus.routes.ts"
import activityGraphRoutes from "./api/routes/frontend/dashboard/activityGraph.routes.ts"
import dateGraphRoutes from "./api/routes/frontend/dashboard/dateGraph.routes.ts"

export const app = express();
app.use(cors());
app.use(express.json());

// Agent routes
app.use('/api',eppPointRoutes)
app.use('/api',logRoutes)
app.use('/api',userRegistrationRoutes)
app.use('/api',registrationStatusRoutes)


// Dashboard routes
app.use('/api',userGroupRoutes)
app.use('/api',groupRoleroutes)
app.use('/api',saveChangesRoutes)
app.use('/api',userCountRoutes)
app.use('/api',complaintScoreRoutes)
app.use('/api',activityGraphRoutes)
app.use('/api',dateGraphRoutes)


// Download routes
app.use('/download',allLogsDownloadRoutes)
app.use('/download',userLogDownloadRoutes)