import { render, screen } from './utils/test-utils';
import MenuList from '@mui/material/MenuList';
import miradorSharePlugin from '../src/miradorSharePlugin';

function createWrapper(props) {
  return render(
    <MenuList>
      <miradorSharePlugin.component handleClose={() => {}} openShareDialog={() => {}} {...props} />
    </MenuList>,
  );
}

describe('miradorSharePlugin', () => {
  it('has the correct target', () => {
    expect(miradorSharePlugin.target).toBe('WindowTopBarPluginMenu');
  });
  describe('renders a component', () => {
    it('renders a thing', () => {
      createWrapper();
      expect(screen.getByText('miradorSharePlugin.menuItemShare')).toBeInTheDocument();
    });
  });

  describe('MenuItem', () => {
    it('calls the openShareDialog and handleClose props when clicked', () => {
      const handleClose = vi.fn();
      const openShareDialog = vi.fn();
      createWrapper({ handleClose, openShareDialog });
      screen.getByText('miradorSharePlugin.menuItemShare').click();
      expect(handleClose).toHaveBeenCalled();
      expect(openShareDialog).toHaveBeenCalled();
    });
  });
});
