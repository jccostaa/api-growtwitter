import swagger from 'swagger-ui-express'

import swaggerJson from "./docs/swagger.json"
import { createApp } from './server'

const app = createApp()

app.use('/docs', swagger.serve)
app.use('/docs', swagger.setup(swaggerJson))

app.listen(3333, () => {
    console.log("Server running on port 3333.");
});