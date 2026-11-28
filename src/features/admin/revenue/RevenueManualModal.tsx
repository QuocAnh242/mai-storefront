'use client';

import React from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Button, Field, Input, Textarea } from '@/components/ui';

const ManualRevenueSchema = z.object({
  amount: z.coerce.number().min(1000, 'Số tiền tối thiểu 1.000đ'),
  date: z.string().min(1, 'Vui lòng chọn ngày ghi nhận'),
  source: z.string().min(1, 'Vui lòng nhập nguồn thu').max(150),
  note: z.string().max(500).optional(),
});

type ManualRevenueForm = z.infer<typeof ManualRevenueSchema>;

interface RevenueManualModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  onSubmitRevenue: (payload: {
    amount: number;
    date: string;
    source: string;
    note: string;
  }) => Promise<void>;
}

export function RevenueManualModal({
  open,
  onOpenChange,
  isSubmitting,
  onSubmitRevenue,
}: RevenueManualModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualRevenueForm>({
    resolver: zodResolver(ManualRevenueSchema) as unknown as Resolver<ManualRevenueForm>,
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      source: 'Bán sỉ tại kho / Cửa hàng',
      note: '',
    },
  });

  const onSubmit = async (values: ManualRevenueForm) => {
    await onSubmitRevenue({
      amount: Number(values.amount),
      date: values.date,
      source: values.source.trim(),
      note: (values.note || '').trim(),
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Ghi Nhận Doanh Thu Mới"
      headerVariant="light"
      size="md"
      closeDisabled={isSubmitting}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
        <Field label="Số tiền thu (VNĐ)" required error={errors.amount?.message}>
          <Input
            type="number"
            placeholder="Ví dụ: 6400000"
            hasError={Boolean(errors.amount)}
            {...register('amount')}
          />
        </Field>

        <Field label="Ngày ghi nhận" required error={errors.date?.message}>
          <Input type="date" hasError={Boolean(errors.date)} {...register('date')} />
        </Field>

        <Field label="Nguồn / Loại thu tiền" required error={errors.source?.message}>
          <Input
            type="text"
            placeholder="Ví dụ: Bán 10 bao Bột màu 313 tại kho"
            hasError={Boolean(errors.source)}
            {...register('source')}
          />
        </Field>

        <Field label="Khách hàng / Ghi chú" error={errors.note?.message}>
          <Textarea
            rows={3}
            placeholder="Thông tin khách hàng hoặc ghi chú thêm..."
            {...register('note')}
          />
        </Field>

        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            Lưu Doanh Thu
          </Button>
        </div>
      </form>
    </Modal>
  );
}
