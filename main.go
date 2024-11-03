package main

import (
    "fmt"
    "github.com/gin-gonic/gin"
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
    "os/exec"
)

type User struct {
    ID            uint   `gorm:"primaryKey"`
    FirstName     string `json:"first_name"`
    LastName      string `json:"last_name"`
    Email         string `json:"email"`
    PhoneNumber   string `json:"phone_number"`
    City          string `json:"city"`
    State         string `json:"state"`
    ResumeLink    string `json:"resume_link"`
    JobPreferences string `json:"job_preferences"`
}

func main() {
    fmt.Println("Starting server...")

    // MySQL Database connection
    dsn := "root:Root@1234#@tcp(127.0.0.1:3306)/my_new_database?charset=utf8mb4&parseTime=True&loc=Local"
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        fmt.Println("Failed to connect to the database:", err)
        return
    }

    fmt.Println("Connected to the MySQL database!")

   
    db.AutoMigrate(&User{})

    r := gin.Default()

    // API Endpoint to accept user data and store it in DB
    r.POST("/apply", func(c *gin.Context) {
        fmt.Println("Received request")
        var user User
        if err := c.ShouldBindJSON(&user); err != nil {
            fmt.Println("Error binding JSON:", err)
            c.JSON(400, gin.H{"error": err.Error()})
            return
        }

        
        fmt.Println("Storing user:", user)
        db.Create(&user)

        
        go func() {
            fmt.Printf("Automating job application for: %s %s\n", user.FirstName, user.LastName)

            
            cmd := exec.Command("node", "automation.js", user.FirstName, user.LastName, user.Email, user.PhoneNumber, user.ResumeLink)
            err := cmd.Run()
            if err != nil {
                fmt.Println("Error running Playwright script:", err)
            }
        }()

        c.JSON(200, gin.H{"status": "Job application is being processed!"})
    })

    fmt.Println("Server is running on port 8081...")
    r.Run(":8081")
}
