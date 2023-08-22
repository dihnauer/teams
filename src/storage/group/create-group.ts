import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppError } from '@utils/AppError';
import { GROUP_COLLECTION } from '@storage/storage-config';
import { getGroups } from './get-groups';

export async function createGroup(newGroup: string) {
  try {
    const storedGroups = await getGroups();
    const groupAlreadyExists = storedGroups.includes(newGroup);

    if (groupAlreadyExists) {
      throw new AppError('Group already exists');
    }

    const storage = JSON.stringify([...storedGroups, newGroup]);

    await AsyncStorage.setItem(GROUP_COLLECTION, storage);
  } catch (error) {
    throw error;
  }
}
