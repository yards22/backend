import { CheckAllowance } from "./middleware";
import RouteHandler, { App, AppRouter } from "./types";

export function HealthRoutes(app: App){
     const appRouter = new AppRouter(app,CheckAllowance)
     appRouter.Get("/",HandleHealth,false)
     return appRouter.NativeRouter
}


const HandleHealth: RouteHandler = async(req,res,next,app)=>{
    app.SendRes(res,{
        status: 200,
        message:"Health Ok !!"
    });
}

