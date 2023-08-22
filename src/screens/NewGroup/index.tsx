import { useNavigation } from '@react-navigation/native';

import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Button } from '@components/Button';
import { Input } from '@components/Input';

import { Container, Content, Icon } from './styles';

export function NewGroup() {
  const navigation = useNavigation();

  function handleNew() {
    navigation.navigate('players', { group: 'Nova turma' });
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

        <Input placeholder='Nome da turma' />

        <Button title='Criar' style={{ marginTop: 20 }} onPress={handleNew} />
      </Content>
    </Container>
  );
}
