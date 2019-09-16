const dbconnect = require('./db');
const db = dbconnect.db

const insertNewIssue = (student, lesson, description, timestamp) => {
    const query = `
        INSERT INTO issues(issue_student, issue_lesson_number, issue_description, issue_timesubmitted)
        VALUES($1, $2, $3, $4);
    `

    return db.oneOrNone(query, [student, lesson, description, timestamp])
}

module.exports = {
    insertNewIssue
}