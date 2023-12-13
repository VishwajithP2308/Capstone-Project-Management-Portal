import React from "react";
import Navbar from "components/Header/navbar";
import { Header, Card } from 'semantic-ui-react'
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

export default function AdminDashboard() {

    const token = Cookies.get("token");
    const payload = jwt_decode(token);
    const navigate = useNavigate();

    const handleLogout = () => {
    Cookies.remove("token");
    navigate("/", { replace: true });
  };
    

  
 
  
    return(
        <>
            <Navbar/>
            
            
           

        <div class="container">
            <div class="row">
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Clients</h5>
                            
                            
                            
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Students</h5>
                            
                            {payload.role !== "CLIENT" && (
                                <p
                                className="courses"
                                onClick={() => navigate("/courses", { replace: true })}
                                >
                                {payload.role === "STUDENT"? "Your Courses" : "Courses"}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Courses</h5>
                            <a href="#" class="btn btn-primary">Go somewhere</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            

            

        

        
       
            
        </>
    )
}

