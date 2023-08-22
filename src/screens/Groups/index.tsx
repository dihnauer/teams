import { useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { EmptyList } from '@components/EmptyList';
import { Button } from '@components/Button';

import { Container } from './styles';
import { getGroups } from '@storage/group/get-groups';

export function Groups() {
  const [groups, setGroups] = useState<string[]>([]);

  const { navigate } = useNavigation();

  function handleNewGroup() {
    navigate('new');
  }

  function handleOpenGroup(group: string) {
    navigate('players', { group });
  }

  async function fetchGroups() {
    try {
      const data = await getGroups();
      setGroups(data);
    } catch (error) {
      console.log(error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );

  return (
    <Container>
      <Header />
      <Highlight title='Turmas' subtitle='Jogue com a sua turma' />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <GroupCard title={item} onPress={() => handleOpenGroup(item)} />
        )}
        ListEmptyComponent={() => (
          <EmptyList message='Que tal cadastrar a primeira turma?' />
        )}
        contentContainerStyle={groups.length === 0 && { flex: 1 }}
      />

      <Button title='Criar nova turma' onPress={handleNewGroup} />
    </Container>
  );
}
