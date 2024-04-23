// scripts/preibuild.
import { updateDatabase } from './update-db';

export async function prebuild() {
    try {
        await updateDatabase();
    }
    catch (error) {
        console.error(error)
    }
}