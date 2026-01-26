import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    marginBottom: 20,
  },
  movieContainer: {
    paddingHorizontal: 16,
    gap: 4,
    paddingVertical: 12,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'red',
  },
  text: {
    fontSize: 14,
    fontWeight: 600,
    color: 'black',
    textAlign: 'justify',
  },
  textCenter: {
    fontSize: 14,
    fontWeight: 600,
    color: 'black',
    textAlign: 'center',
  },
});

export default styles;
