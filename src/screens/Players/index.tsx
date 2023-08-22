import { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { AppError } from '@utils/AppError';

import { addPlayerByGroup } from '@storage/players/add-player-by-group';
import { getPlayersByGroupAndTeam } from '@storage/players/get-players-by-group-and-team';
import { PlayerStorageDTO } from '@storage/players/PlayerStorageDTO';

import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { ButtonIcon } from '@components/ButtonIcon';
import { Input } from '@components/Input';
import { Filter } from '@components/Filter';
import { PlayerCard } from '@components/PlayerCard';
import { EmptyList } from '@components/EmptyList';
import { Button } from '@components/Button';

import { Container, Form, HeaderList, NumberOfPlayers } from './styles';

interface RouteParams {
  group: string;
}

export function Players() {
  const [newPlayer, setNewPlayer] = useState('');
  const [team, setTeam] = useState('Time A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

  const route = useRoute();
  const { group } = route.params as RouteParams;

  async function handleAddPlayer() {
    if (newPlayer.trim().length === 0) {
      return Alert.alert('Novo jogador', 'Por favor, digite o nome do jogador');
    }

    const player = {
      name: newPlayer,
      team,
    };

    try {
      await addPlayerByGroup(player, group);
      fetchPlayersByTeam();
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Novo jogador', error.message);
      } else {
        Alert.alert('Novo jogador', 'Não foi possível adicionar o jogador');
        console.log(error);
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      const playersByTeam = await getPlayersByGroupAndTeam(group, team);
      setPlayers(playersByTeam);
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Jogadores',
        'Não foi possível carregar os jogadores do time selecionado'
      );
    }
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <Container>
      <Header showBackButton />

      <Highlight title={group} subtitle='Adicione a galera e separe os times' />

      <Form>
        <Input
          placeholder='Nome da pessoa'
          autoCorrect={false}
          onChangeText={setNewPlayer}
        />
        <ButtonIcon icon='add' onPress={handleAddPlayer} />
      </Form>

      <HeaderList>
        <FlatList
          data={['Time A', 'Time B']}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />

        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      </HeaderList>

      <FlatList
        data={players}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <PlayerCard name={item.name} onRemove={() => {}} />
        )}
        ListEmptyComponent={() => (
          <EmptyList message='Não há pessoas nesse time' />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom: 60 },
          players.length === 0 && { flex: 1, paddingBottom: 0 },
        ]}
      />

      <Button title='Remover' type='SECONDARY' />
    </Container>
  );
}
