import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  flex: 1;
  padding: 1.5rem; 
  border-bottom: 1px solid var(--border-color);

  &:last-of-type {
    border-bottom: none;
  }
`;

export const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  color: var(--text-color);
  background: var(--card-bg);

  border-radius: var(--card-border-radius);
  border: 1px solid var(--border-color);
  transition: var(--theme-transition);
`;
