package db

type FieldType uint8
const (
    INT     FieldType = iota
    STRING
)

var ValidFields []string = []string {
    "id",
    "team_id",
    "name",
    "last_name",
    "document",
    "birth",
    "area",
}

func IsValidField(str string) bool {
    for _, field := range ValidFields {
        if field == str { return true }
    }

    return false
}

type QueryParam struct {
    ParamName string
    ParamType FieldType
    ParamValue string
}

