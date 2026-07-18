import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SosPage } from './SosPage';

describe('SosPage MVP Component Tests', () => {
  it('renders the Safety Page, trigger button, and default elements', () => {
    render(<SosPage />);

    expect(screen.getByRole('heading', { name: /Safety & Emergency Center/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Emergency SOS Trigger/i })).toBeInTheDocument();
    expect(screen.getAllByText('Sarah Connor')[0]).toBeInTheDocument();
  });

  it('triggers emergency alert after holding the distress button for 5 seconds', () => {
    vi.useFakeTimers();
    render(<SosPage />);

    const sosBtn = screen.getByRole('button', { name: /Emergency SOS Trigger/i });

    // Simulate press-and-hold trigger
    fireEvent.mouseDown(sosBtn);

    // Fast-forward 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Check that distress broadcast alert is visible
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/🚨 MOCK SOS BROADCAST ACTIVE/i)).toBeInTheDocument();

    // Cancel SOS broadcast
    const cancelBtn = screen.getByRole('button', { name: /Cancel SOS Broadcast/i });
    fireEvent.click(cancelBtn);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('does not trigger emergency if button is released before 5 seconds hold', () => {
    vi.useFakeTimers();
    render(<SosPage />);

    const sosBtn = screen.getByRole('button', { name: /Emergency SOS Trigger/i });

    // Press down
    fireEvent.mouseDown(sosBtn);

    // Wait only 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Release mouse
    fireEvent.mouseUp(sosBtn);

    // Expect distress alert to NOT be triggered
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('allows toggling safety alerts settings options', () => {
    render(<SosPage />);

    const crashToggle = screen.getByRole('switch', { name: /Automatic Crash Detection/i });
    expect(crashToggle).toHaveAttribute('aria-checked', 'true');

    // Toggle switch
    fireEvent.click(crashToggle);
    expect(crashToggle).toHaveAttribute('aria-checked', 'false');
  });

  it('allows adding, editing, and deleting emergency contacts', () => {
    render(<SosPage />);

    // --- ADD CONTACT FLOW ---
    const addBtn = screen.getByRole('button', { name: /Add Contact/i });
    fireEvent.click(addBtn);

    // Fill form fields
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Bruce Wayne' } });
    fireEvent.change(screen.getByLabelText(/Relationship/i), { target: { value: 'Ally' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '+1 (555) 000-0000' } });
    fireEvent.change(screen.getByLabelText(/Priority Index/i), { target: { value: '3' } });

    // Submit save contact
    const saveBtn = screen.getByRole('button', { name: /Save Contact/i });
    fireEvent.submit(saveBtn);

    // Verify contact was added
    expect(screen.getAllByText('Bruce Wayne')[0]).toBeInTheDocument();

    // --- EDIT CONTACT FLOW ---
    // Edit Bruce Wayne contact
    const editBtns = screen.getAllByRole('button', { name: /Edit/i });
    const targetEditBtn = editBtns[editBtns.length - 1];
    if (!targetEditBtn) throw new Error('Edit button not found');
    fireEvent.click(targetEditBtn);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Bruce Wayne Edited' } });
    fireEvent.submit(screen.getByRole('button', { name: /Save Contact/i }));

    expect(screen.getAllByText('Bruce Wayne Edited')[0]).toBeInTheDocument();

    // --- DELETE CONTACT FLOW ---
    const deleteBtns = screen.getAllByRole('button', { name: /Delete/i });
    const targetDeleteBtn = deleteBtns[deleteBtns.length - 1];
    if (!targetDeleteBtn) throw new Error('Delete button not found');
    fireEvent.click(targetDeleteBtn);

    expect(screen.queryAllByText('Bruce Wayne Edited').length).toBe(0);
  });
});
