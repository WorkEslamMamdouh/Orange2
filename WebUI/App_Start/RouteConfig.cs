using System.Web.Mvc;
using System.Web.Routing;

namespace Inv.WebUI
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {


            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");


            routes.MapRoute(
            name: "OpenPdf",
            url: "{N}",
            defaults: new { controller = "H", action = "O"}
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Login", action = "HomePage", id = UrlParameter.Optional }
            //defaults: new { controller = "Home", action = "HomeIndex", id = UrlParameter.Optional }
            //  defaults: new { controller = "Home", action = "AdminBarIndex", id = UrlParameter.Optional }
            );


            //routes.MapRoute(
            //      name: "Open",
            //     url: "{id}",
            //     defaults: new { controller = "H", action = "O"  },
            //     constraints: new { id = @"\d+" }
            //);





        }
    }
}
