package db

import (
	"database/sql"
	"fmt"

    "nosfer-db/pkg"
    _ "github.com/lib/pq"
)

func CreateDb() (*sql.DB, error) {
    env := pkg.GetEnv()

    var connStr string = fmt.Sprintf("user=%s password=%s dbname=%s host=%s",
        env["user"],
        env["password"],
        env["dbname"],
        env["host"],
    )

    db, openErr := sql.Open("postgres", connStr)
    if openErr != nil {
        return nil, openErr
    }

    return db, nil
}





