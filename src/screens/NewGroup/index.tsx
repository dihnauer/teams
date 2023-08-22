import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Button } from '@components/Button';
import { Input } from '@components/Input';

import { Container, Content, Icon } from './styles';
import { createGroup } from '@storage/group/create-group';

export function NewGroup() {
  const [group, setGroup] = useState('');

  const navigation = useNavigation();

  async function handleNew() {
    try {
      await createGroup(group);
      navigation.navigate('players', { group });
    } catch (error) {
      console.log(error);
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
