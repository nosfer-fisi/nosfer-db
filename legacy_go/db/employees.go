package db

import (
	"database/sql"
	"fmt"
	"log"
)

type Employee struct{
    Id int              `json:"id"`
    TeamId string       `json:"team"`
    Name string         `json:"name"`
    LastName string     `json:"last_name"`
    Document string     `json:"document"`
    Birth string        `json:"birth"`
    Area string         `json:"area"`
}

func RegisterEmployee(db *sql.DB, employee Employee) (int, error) {
    var id int
    rows, err := db.Query("insert into \"Employee\" (team_id, name, last_name, document, birth, area) values ($1, $2, $3, $4, $5, $6) returning id;", employee.TeamId, employee.Name, employee.LastName, employee.Document, employee.Birth, employee.Area)

    if rows.Next() {
        errScan := rows.Scan(&id)
        if errScan != nil {
            return -1, errScan;
        }
    }

    return id, err
}

func QueryEmployees(db *sql.DB, fields []QueryParam) ([]Employee, error) {
    baseQueryStr := "select * from \"Employee\""
    countQueryStr := "select count (*) from \"Employee\""
    lenFields := len(fields)

    if lenFields != 0 {
        whereStr := " where "
        for i, field := range fields {
            if field.ParamType == STRING {
                whereStr += field.ParamName + " = '" + field.ParamValue + "'"
            } else {
                whereStr += field.ParamName + " = " + field.ParamValue
            }

            if i != lenFields - 1 {
                whereStr += " AND "
            }
        }

        baseQueryStr += whereStr + ";"
        countQueryStr += whereStr + ";"
    }

    rows, err := db.Query(baseQueryStr)
    if err != nil {
        return nil, err
    }

    log.Printf("%s [] %s", baseQueryStr, countQueryStr)

    var num int
    count, counQueryErr := db.Query(countQueryStr)
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
                &returned[i].TeamId,
                &returned[i].Name,
                &returned[i].LastName,
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

