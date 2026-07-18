import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { WhatsAppCenterPage } from './WhatsAppCenterPage';

describe('WhatsAppCenterPage MVP Component Tests', () => {
  it('renders the WhatsApp Center dashboard titles and analytics counters', () => {
    render(<WhatsAppCenterPage />);

    expect(screen.getByRole('heading', { name: /WhatsApp Dispatch & Invite Center/i })).toBeInTheDocument();
    expect(screen.getByText('142')).toBeInTheDocument(); // total mock broadcasts
    expect(screen.getByText('3')).toBeInTheDocument(); // active links count
  });

  it('updates dynamic links when changing link expiration select value', () => {
    render(<WhatsAppCenterPage />);

    const linkInput = screen.getByLabelText(/Invitation Link Url/i);
    expect(linkInput.getAttribute('value')).toContain('expires=7-days');

    const select = screen.getByRole('combobox', { name: /Link Expiration Settings:/i });
    fireEvent.change(select, { target: { value: '24-hours' } });

    expect(linkInput.getAttribute('value')).toContain('expires=24-hours');
  });

  it('allows copying dynamic link url', () => {
    // Mock navigator clipboard
    const mockClipboard = {
      writeText: vi.fn().mockImplementation(() => Promise.resolve()),
    };
    Object.assign(navigator, { clipboard: mockClipboard });

    render(<WhatsAppCenterPage />);

    const copyBtn = screen.getByRole('button', { name: /Copy/i });
    fireEvent.click(copyBtn);

    expect(mockClipboard.writeText).toHaveBeenCalled();
  });

  it('compiles message broadcast and opens wa.me links in external new window tab', () => {
    const mockOpen = vi.fn();
    vi.stubGlobal('open', mockOpen);

    render(<WhatsAppCenterPage />);

    // Click compile link for Live Location Sharing (first scenario card)
    const compileBtns = screen.getAllByRole('button', { name: /Compile Link/i });
    const firstCompileBtn = compileBtns[0];
    if (!firstCompileBtn) throw new Error('Compile button not found');
    fireEvent.click(firstCompileBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Verify textarea has default template message
    const textarea = screen.getByLabelText(/Compile Broadcast Message/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain('Hey! You can track our vehicle real-time');

    // Click "Open WhatsApp Share" to launch external redirect
    const launchBtn = screen.getByRole('button', { name: /Open WhatsApp Share/i });
    fireEvent.submit(launchBtn);

    // Verify window.open was triggered on https://wa.me/ targets
    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/?text=Hey'),
      '_blank'
    );

    // Check modal closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Verify analytics counter incremented
    expect(screen.getByText('143')).toBeInTheDocument();

    vi.unstubAllGlobals();
  });
});
