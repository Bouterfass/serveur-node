const express = require('express')
const dayjs = require('dayjs')
const localizedFormat = require('dayjs/plugin/localizedFormat')
require('dayjs/locale/fr')
const app = express()
const path = require('path')
const port = process.env.APP_PORT || 3000
const students = [
    { id: 0, name: "Sonia", birth: "2019-14-05" },
    { id: 1, name: "Antoine", birth: "2000-12-05" },
    { id: 2, name: "Alice", birth: "1990-14-09" },
    { id: 3, name: "Sophie", birth: "2001-10-02" },
    { id: 4, name: "Bernard", birth: "1980-21-08" }
]

dayjs.extend(localizedFormat)


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))

app.use(express.static('assets'))

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render(__dirname + '/views/home.ejs')
})

app.get('/users', (req, res) => {
    const studs = students.map(s => ({ ...s, birthdate: dayjs(s.birth).locale('fr').format('dddd DD MMMM YYYY')}))
    res.render(__dirname + '/views/users.ejs', { studs })
});

app.post('/users/add', (req, res) => {
    const { name, birth } = req.body;
    if (name && birth) {
        const user = { name, birth };
        students.push({...user, id: students.length});
        res.redirect('/users');
    } else {
        res.status(400).send('Invalid user data');
    }
});

app.post('/users/delete/:id', (req, res) => {
    const id = req.params.id;
    const studId = students.findIndex(el => el.id == id)
    students.splice(studId, 1);
    res.redirect('/users');
});


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
