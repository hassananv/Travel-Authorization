import knex, { Knex } from 'knex';
import { DB_CONFIG } from '../config';
import _, { map } from 'lodash';
import axios from 'axios';
import { timeStamp } from 'console';
export class AuditService {
	private db: Knex;

	constructor() {
		this.db = knex(DB_CONFIG);
	}

	async insertAudit(
		userId: number,
		taid: number,
		action: string
	): Promise<any | undefined> {
		try {
			let timeStamp = new Date();
			await this.db('auditHistory').insert({ userId, taid, action, timeStamp });

			return true;
		} catch (error: any) {
			console.log(error);
		}
	}
}