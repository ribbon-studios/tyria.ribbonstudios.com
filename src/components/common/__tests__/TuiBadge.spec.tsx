import { render } from '@testing-library/react';
import { TuiBadge } from '../TuiBadge';
import { describe, expect, it } from 'vitest';
import { chance } from '@/__tests__/chance';

describe('<TuiBadge />', () => {
  describe('prop(children)', () => {
    it('should support providing children', () => {
      const expectedText = chance.word();

      const { queryByText } = render(<TuiBadge children={expectedText} />);

      expect(queryByText(expectedText)).toBeInTheDocument();
    });
  });
});
