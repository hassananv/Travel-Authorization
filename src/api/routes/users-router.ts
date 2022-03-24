import express, { Request, Response } from 'express';
import { DB_CONFIG } from '../config';
import knex from 'knex';
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';

export const userRouter = express.Router();
const db = knex(DB_CONFIG);

userRouter.get('/me', async (req: Request, res: Response) => {
	let person = req.user;

	if (person) return res.json({ data: await makeDTO(person) });
});

async function makeDTO(userRaw: any) {
	let dto = userRaw;
	dto.display_name = `${userRaw.first_name} ${userRaw.last_name}`;
	//dto.roles = _.split(userRaw.roles, ",").filter(r => r.length > 0);
	//dto.access = await db.getAccessFor(userRaw.email);
	//dto.display_access = _.join(dto.access.map((a: any) => a.level), ", ")

	return dto;
}
