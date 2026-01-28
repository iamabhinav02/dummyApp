import { StyleSheet } from 'react-native';
import { IColors } from '../../constants/colors';

const styles = (colors: IColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.SURFACE.PRIMARY,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    marginBottom: 20,
    gap: 16,
    paddingHorizontal: 16,
  },
  movieContainer: {
    paddingHorizontal: 16,
    gap: 4,
    paddingVertical: 12,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: colors.SURFACE.TERTIARY,
  },
  text: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.TEXT.PRIMARY,
    textAlign: 'justify',
  },
  textCenter: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.TEXT.PRIMARY,
    textAlign: 'center',
  },
});

export default styles;
