import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';
import { rest } from 'msw'
import { setupServer } from 'msw/node'

describe('App', () => {
  const server = setupServer(
    // mock GET /recipes/
    rest.get('http://localhost/recipes/', (req, res, ctx) => {
      return res(ctx.json([
        {
          id: '1',
          name: 'Pizza',
          description: 'Bake in the oven',
          ingredients: [
            {
              name: 'cheese'
            },
            {
              name: 'tomato'
            }
          ]
        },
        {
          id: '2',
          name: 'Beans on toast',
          description: 'Cook on the hob and in the toaster',
          ingredients: [
            {
              name: 'baked beans'
            },
            {
              name: 'bread'
            }
          ]
        }
      ]));
    }),

    // mock GET /recipes/1/
    rest.get('http://localhost/recipes/1/', (req, res, ctx) => {
      return res(ctx.json(
        {
          id: '1',
          name: 'Pizza',
          description: 'Bake in the oven',
          ingredients: [
            {
              name: 'cheese'
            },
            {
              name: 'tomato'
            }
          ]
        }));
    }),
  )

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('renders App component no data', async () => {
    server.use(
      rest.get('http://localhost/recipes/', (req, res, ctx) => {
        return res(ctx.json([]));
      }),
    );

    render(<App />);

    expect(screen.queryAllByTestId('recipe-item').length).toBe(0);

    // screen.debug();
  });

  test('renders App component with data', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryAllByTestId('recipe-item').length).toBe(2);
    });

    // screen.debug();
  });

  test('renders App component with data and a recipe selected', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryAllByTestId('recipe-item').length).toBe(2);
    });

    // select recipe
    fireEvent.click(screen.getByText('Pizza'));

    await waitFor(() => {
      expect(screen.getByTestId('edit-btn')).toBeInTheDocument()
    });

    expect(screen.getByTestId('name')).toHaveTextContent('Pizza');
    expect(screen.getByTestId('description')).toHaveTextContent('Bake in the oven');
    expect(screen.getByTestId('ingredients')).toHaveTextContent('cheese, tomato');

    // screen.debug();
  });

  test('renders App component with data and a recipe selected and "Edit" clicked', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryAllByTestId('recipe-item').length).toBe(2);
    });

    // select recipe
    fireEvent.click(screen.getByText('Pizza'));

    await waitFor(() => {
      expect(screen.getByTestId('edit-btn')).toBeInTheDocument()
    });

    // click edit
    fireEvent.click(screen.getByTestId('edit-btn'));

    await waitFor(() => {
      expect(screen.getByText('cheese')).toBeInTheDocument()
      expect(screen.getByText('tomato')).toBeInTheDocument()
    });

    // screen.debug();
  });
});
