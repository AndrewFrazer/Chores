using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ChoresLib.Services;
using ChoresLib.Schema;
using ChoresLib.Postgres;
using GraphQL;
using GraphQL.Server;
using GraphQL.Server.Ui.GraphiQL;
using Microsoft.EntityFrameworkCore;

namespace ChoresServer
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;
            Environment = env;
        }

        public IConfiguration Configuration { get; }
        public IHostingEnvironment Environment { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddCors(options => options.AddPolicy("AllowAllOrigins", p => p.AllowAnyOrigin()
                                                                    .AllowAnyMethod()
                                                                    .AllowAnyHeader()));
            // db services
            services.AddDbContext<ChoresContext>(options =>
                options.UseNpgsql(Configuration.GetConnectionString("ChoresDb")));
            services.AddScoped<IChoreService, ChoreService>();
            services.AddScoped<IUserService, UserService>();
            // types
            services.AddScoped<ChoreType>();
            services.AddScoped<UserType>();
            services.AddScoped<ChoreInputType>();
            // querys and mutations
            services.AddScoped<Query>();
            services.AddScoped<ChoreMutation>();
            // schema
            services.AddScoped<ChoresSchema>();
            services.AddScoped<IDependencyResolver>(
                c => new FuncDependencyResolver(type =>
                    c.GetRequiredService(type)));
            services.AddGraphQL(options =>
            {
                options.EnableMetrics = true;
                options.ExposeExceptions = Environment.IsDevelopment();
            })
            .AddWebSockets();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app)
        {
            if (Environment.IsDevelopment())
                app.UseDeveloperExceptionPage();

            app.UseCors("AllowAllOrigins");

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseWebSockets();
            app.UseGraphQLWebSockets<ChoresSchema>("/graphql");

            app.UseGraphQL<ChoresSchema>("/graphql");
            app.UseGraphiQLServer(new GraphiQLOptions());

            app.UseCors("AllowAllOrigins");
            app.UseMvc();

            //app.Run(async (context) =>
            //{
            //    await context.Response.WriteAsync("Hello World!");
            //});
        }
    }
}
