import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('database created');
    },
  });

export const putDb = async (id, content) => {
  try {
    console.log('in the post');
    const jateDb = await openDB('jate', 1);
    const tx = jateDb.transaction('jate', 'readwrite');
    const store = tx.objectStore('jate');
    const request = store.put({ id: id, jate: content });
    const result = await request;
    console.log('text saved to the database', result);
  } catch (err) {
    console.error('putDb err', err);
  }
}

export const getDb = async () => {

  console.log('in the get');

  try {

    const jateDb = await openDB('jate', 1);
    const tx = jateDb.transaction('jate', 'readonly');
    const store = tx.objectStore('jate');
    const request = store.getAll();

    const result = await request;

    return result[0].content;
  } catch {
    console.log(err)
    console.error('getDB err')
  }
}

initdb();
