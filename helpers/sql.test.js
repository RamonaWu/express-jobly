// its a unit test for sqlforPartialUpdate function
// this two test is checking the behavior of the sqlForPartialUpdate function 
//when provided with one or two item to update. 

const { sqlForPartialUpdate } = require("./sql");

describe("sqlForPartialUpdate", function () {
    test("works: 1 item", function() {
        const result = sqlForPartialUpdate({firstName: 'Aliya'}, {firstName: 'first_name'});
        expect(result).toEqual({
            setCols: '"first_name"=$1',
            values: ['Aliya']
        })
    });

    test("works: 2 items", function() {
        const result = sqlForPartialUpdate({firstName: 'Aliya', age: 32}, 
            {firstName: 'first_name', age: 'age'});
        expect(result).toEqual({
            setCols: '"first_name"=$1, "age"=$2',
            values: ['Aliya', 32]
        })
    });
});

