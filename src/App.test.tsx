import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import getMetrics from './getMetrics';
jest.mock('./getMetrics');

const mockedMetrics = getMetrics as jest.MockedFunction<typeof getMetrics>;

describe('Frotend Metrics', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  it('should display the initial mocked values', async () => {
    jest.useFakeTimers();

    const epochTime = Math.round(Date.now() / 1000);
    const mockedMetricsFirst = 'http_requests_total{route="/time",method="GET",status="2XX"} 1';

    mockedMetrics.mockResolvedValue([{ time: epochTime }, mockedMetricsFirst]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(mockedMetricsFirst)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(epochTime)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/00:00:01/i)).toBeInTheDocument();
    });
  });

  it('should display the correct updated data from the metrics api after 30 secs', async () => {
    jest.useFakeTimers();

    const epochTime = Math.round(Date.now() / 1000);
    const mockedMetricsFirst = 'http_requests_total{route="/time",method="GET",status="2XX"} 1';
    const mockedMetricsSecond = 'http_requests_total{route="/time",method="GET",status="2XX"} 2';

    mockedMetrics.mockResolvedValue([{ time: epochTime }, mockedMetricsFirst]);
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(mockedMetricsFirst)).toBeInTheDocument();
    });

    mockedMetrics.mockResolvedValue([{ data: { time: epochTime } }, mockedMetricsSecond]);

    jest.advanceTimersByTime(30000);

    await waitFor(() => {
      expect(screen.getByText(mockedMetricsSecond)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/00:00:00/i)).toBeInTheDocument();
    });
  });
});
