package db

import (
	"database/sql"
	"fmt"
	"log"
)

type Employee struct{
    Id int              `json:"id"`
    Team_id string      `json:"team"`
    Name string         `json:"name"`
    Last_name string    `json:"last"`
    Document string     `json:"document"`
    Birth string        `json:"birth"`
    Area string         `json:"area"`
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

func GetAllEmployees(db *sql.DB) ([]Employee, error) {
    queryStr := fmt.Sprintf("select * from \"Employee\"")
    rows, err := db.Query(queryStr)
    if err != nil {
        return nil, nil
    }

    var num int
    count, counQueryErr := db.Query("select count (id) from \"Employee\";")
    if counQueryErr != nil {
        log.Panicln(counQueryErr)
    }

    if !count.Next() {
        num = 0
    }

    if scanErr := count.Scan(&num); scanErr != nil {
        log.Panicln(scanErr)
    }

    returned := make([]Employee, num)
    for i := range returned {
        if rows.Next() {
            errScan := rows.Scan(
                &returned[i].Id,
                &returned[i].Team_id,
                &returned[i].Name,
                &returned[i].Last_name,
                &returned[i].Document,
                &returned[i].Birth,
                &returned[i].Area,
            );
            if errScan != nil{
                return nil, errScan
            }
        }
    }


    return returned, nil
}

func GetEmployeeById(db *sql.DB, id int) (*sql.Rows, error) {
    queryStr := fmt.Sprintf("select * from \"Employee\" where id=%d", id)
    return db.Query(queryStr)
}

