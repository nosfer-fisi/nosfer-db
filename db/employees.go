package db

import (
	"database/sql"
	"fmt"
)

type Employee struct{
    Id int
    Team_id string
    Name string
    Last_name string
    Document string
    Birth string
    Area string
}

func RegisterEmployee(db *sql.DB, team_id int, name string, last_name string, document string, birth string, area string) (int, error) {
    var id int
    rows, err := db.Query("insert into \"Employee\" (team_id, name, last_name, document, birth, area) values ($1, $2, $3, $4, $5, $6) returning id;", team_id, name, last_name, document, birth, area)

    if rows.Next() {
        errScan := rows.Scan(&id)
        if errScan != nil {
            return -1, errScan;
        }
    }

    return id, err
}

func GetAllEmployees(db *sql.DB, id int) ([]Employee, error) {
    var returned []Employee
    var tmp Employee

    queryStr := fmt.Sprintf("select * from \"Employee\"")
    rows, err := db.Query(queryStr)
    if err != nil {
        return nil, nil
    }

    for rows.Next() {
        if errScan := rows.Scan(
            &tmp.Id,
            &tmp.Team_id,
            &tmp.Name,
            &tmp.Last_name,
            &tmp.Document,
            &tmp.Birth,
            &tmp.Area,
        ); errScan != nil {
            return nil, errScan
        }

        returned = append(returned, tmp)
    }


    return returned, nil
}

func GetEmployeeById(db *sql.DB, id int) (*sql.Rows, error) {
    queryStr := fmt.Sprintf("select * from \"Employee\" where id=%d", id)
    return db.Query(queryStr)
}

