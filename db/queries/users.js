//TODO #3a . Created users.js query file with:
//createUser(username, password) - Creates users with bcrypt-hashed passwords (10 salt rounds)
//getUserById(id), getUsers() - For retrieving users
//getUserByUsernameAndPassword(username, password) - For authentication

import bcrypt from "bcrypt";
import db from "#db/client";

export async function createUser(username, password) {
  const sql = `
  INSERT INTO users
    (username, password)
  VALUES
    ($1, $2)
  RETURNING *
  `;
  const hashedPassword = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}

export async function getUsers() {
  const sql = `
  SELECT *
  FROM users
  `;
  const { rows: users } = await db.query(sql);
  return users;
}

export async function getUserById(id) {
  const sql = `
  SELECT *
  FROM users
  WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}

export async function getUserByUsernameAndPassword(username, password) {
  const sql = `
  SELECT *
  FROM users
  WHERE username = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username]);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}
