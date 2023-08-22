import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { AppError } from '@utils/AppError';
import { createGroup } from '@storage/group/create-group';

import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Button } from '@components/Button';
import { Input } from '@components/Input';

import { Container, Content, Icon } from './styles';
import { Alert } from 'react-native';

export function NewGroup() {
  const [group, setGroup] = useState('');

  const navigation = useNavigation();

  async function handleNew() {
    try {
      if (!group || group.trim().length === 0) {
        throw new AppError('Por favor, informe um nome para a turma');
      }

      await createGroup(group);
      navigation.navigate('players', { group });
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Nova turma', error.message);
      } else {
        Alert.alert('Nova turma', 'Não foi possível criar o grupo');
        console.log(error);
      }
    }
  }
  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />

        <Highlight
          title='Nova turma'
          subtitle='Crie uma nova turma e adicione seus amigos'
        />

        <Input placeholder='Nome da turma' onChangeText={setGroup} />

        <Button title='Criar' style={{ marginTop: 20 }} onPress={handleNew} />
      </Content>
    </Container>
  );
}
