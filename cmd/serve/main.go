package main

import (
	"log"

	dbutils "nosfer-db/db"

	_ "github.com/lib/pq"
)


func main() {
    db, errCreate := dbutils.CreateDb()
    if errCreate != nil {
        log.Println(errCreate)
        return
    }

    employeeId, registerErr := dbutils.RegisterEmployee(db, 0, "Victor", "Alva", "32820241", "1966-01-08", "banco de sangre")
    if registerErr != nil {
        log.Println(registerErr)
        return
    }

    rows, empErr := dbutils.GetEmployeeById(db, employeeId)
    if empErr != nil {
        log.Println(empErr)
        return
    }

    if !rows.Next() {
        return
    }

    rows.Scan()
}






