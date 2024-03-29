import { useEffect, useState, useRef } from 'react';
import { Alert, FlatList, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AppError } from '@utils/AppError';

import { addPlayerByGroup } from '@storage/players/add-player-by-group';
import { getPlayersByGroupAndTeam } from '@storage/players/get-players-by-group-and-team';
import { PlayerStorageDTO } from '@storage/players/PlayerStorageDTO';
import { removePlayerByGroup } from '@storage/players/remove-player-by-group';
import { removeGroupByName } from '@storage/group/remove-group-by-name';

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

  const navigation = useNavigation();
  const route = useRoute();
  const { group } = route.params as RouteParams;

  const newPlayerInputRef = useRef<TextInput>(null);

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
      await fetchPlayersByTeam();
      newPlayerInputRef.current?.blur();
      setNewPlayer('');
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Novo jogador', error.message);
      } else {
        Alert.alert('Novo jogador', 'Não foi possível adicionar o jogador');
        console.log(error);
      }
    }
  }

  async function handleRemovePlayer(playerName: string) {
    try {
      await removePlayerByGroup(playerName, group);
      await fetchPlayersByTeam();
    } catch (error) {
      console.log(error);
      Alert.alert('Remover jogador', 'Não foi possível remover o jogador');
    }
  }

  async function removeGroup() {
    try {
      await removeGroupByName(group);
      navigation.navigate('groups');
    } catch (error) {
      console.log(error);
      Alert.alert('Remover Turma', 'Não foi possível remover a turma');
    }
  }

  async function handleRemoveGroup() {
    Alert.alert('Remover', 'Deseja remover a turma?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: async () => removeGroup() },
    ]);
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
          value={newPlayer}
          inputRef={newPlayerInputRef}
          onSubmitEditing={handleAddPlayer}
          returnKeyType='done'
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
          <PlayerCard
            name={item.name}
            onRemove={() => handleRemovePlayer(item.name)}
          />
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

      <Button title='Remover' type='SECONDARY' onPress={handleRemoveGroup} />
    </Container>
  );
}
