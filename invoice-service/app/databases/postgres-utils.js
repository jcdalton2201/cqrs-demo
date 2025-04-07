import pkg from 'pg';
const { Pool } = pkg;
import config from '../config/environment/index.js';
import  { Logs } from '../util/log.js';

export class PostgresUtils {
    constructor() {
        this.client = new Pool({
            host: config.postgres.host,
            user: config.secret_names.postgres.user,
            password: config.secret_names.postgres.password,
            database: config.postgres.database
        });
        this.logger = new Logs();
    }

    async retrieve(table, query, limit, offset, order_by){
        let where ='';
        let join = '';
        let limitStr = limit ? `LIMIT ${limit}` : '';
        let offsetStr = offset ? `OFFSET ${offset}` : '';
        let orderByStr = order_by ? `ORDER BY ${order_by}` : '';
        if (query){
            if(query.id){
                where = ` WHERE id = '${query.id}'`
            }
            if(query.join){
                join = query.join;
            }
        }
        let updateQuery = this.buildWhere(query);
        const results = await this.client.query(`SELECT * FROM ${table}${updateQuery} ${join} ${orderByStr} ${limitStr} ${offsetStr}`);
        return results.rows;
    }
    async getInvoice(userid, month, year){
        const results = await this.client.query(
            `SELECT * FROM demo.invoices WHERE user_id = $1 AND EXTRACT(YEAR FROM invoice_dt) = $2 AND EXTRACT(MONTH FROM invoice_dt) = $3`,[userid,year,month]);
        return results.rows;
    }
    async insert(table, data) {
        let insertQuery = this.buildInsert(table, data);
        let values = this.buildValues(data);
        try {
            const insertResult = await this.client.query(insertQuery, values);
            return insertResult.rows[0];
        } catch (error) {
            this.logger.error(error);
        }
    }
    async updateOne(table, id, data) {
        if (!id) {
            id = uuidv4();
        }
        const record = {
            id,
            ...data,
        };
        let insertQuery = this.buildInsert(table, record);
        let updateQuery = this.buildUpdate(table, record);

        let values = this.buildValues(record);
        try {
            const results = await this.client.query(updateQuery, values);
            if (results.rowCount > 0) {
                return record;
            } else {
                const insertResult = await this.client.query(
                    insertQuery,
                    values,
                );
                return insertResult.rows[0];
            }
        } catch (error) {
            this.logger.error(error);
        }
    }
    buildWhere(query) {
        let where = '';
        const keys = Object.keys(query);
        keys.forEach((key, index) => {
            let firstWhere = '';
            let like = 'ILIKE';
            let queryLike = `'%${query[key]}%'`;
            if (index === 0) {
                firstWhere = ' WHERE ';
            }
            if (key === 'filter') {
                key = '';
                like = '';
                queryLike = query['filter']
                    .replaceAll(':', ' AND ')
                    .replaceAll(';', ' OR ');
            }
            if (key === 'id') {
                like = '=';
                queryLike = `'${query[key]}'`;
            }
            where = `${firstWhere}${where} AND ${key} ${like} ${queryLike}`;
        });
        return where.replace('AND', '');
    }
    buildInsert(table, record) {
        let values = '';
        let keys = '';
        Object.keys(record).forEach((item, index) => {
            values = values + item + ', ';
            keys = keys + '$' + (index + 1) + ', ';
        });
        values = this.camelToSnake(values.substring(0, values.lastIndexOf(', ')));
        keys = keys.substring(0, keys.lastIndexOf(', '));
        console.log(`INSERT INTO ${table}(${values}) VALUES(${keys}) RETURNING *`);
        return `INSERT INTO ${table}(${values}) VALUES(${keys}) RETURNING *`;
    }
    buildUpdate(table, record) {
        let update = '';
        let key = '';
        Object.keys(record).forEach((item, index) => {
            if (index === 0) {
                key = `${item} = $1`;
            } else {
                update = this.camelToSnake(`${update}${item} = $${index + 1}, `);
            }
        });
        update = update.substring(0, update.lastIndexOf(', '));
        return `UPDATE ${table} SET ${update} WHERE ${key}`;
    }
    buildValues(record) {
        return Object.values(record);
    }
    camelToSnake(item) {
        console.log(item);
        const words = item.replace(/[A-Z]/g, (match) => {
            return '_' + match.toLowerCase();
        });
        console.log(words);
        return words;
    }
}