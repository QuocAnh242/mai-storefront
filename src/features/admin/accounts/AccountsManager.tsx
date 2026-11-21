"use client";

import React, { useState, useEffect } from "react";
import { Loading, TableRowsSkeleton } from "@/components/ui/Loading";
import { useToast } from "@/shared/context/ToastContext";

interface Account {
  id: string;
  email: string;
  fullName: string;
  role: "super_admin";
  createdAt: string;
  lastLoginAt?: string;
}

export function AccountsManager() {
  const { showToast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [requiresServiceRole, setRequiresServiceRole] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal: Create Account
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Modal: Change Password
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [changePasswordVal, setChangePasswordVal] = useState("");
  const [changeConfirmVal, setChangeConfirmVal] = useState("");
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // Load Accounts via Real Supabase API
  const loadAccounts = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const res = await fetch("/api/admin/accounts");
      const json = await res.json();

      if (json.requiresServiceRole) {
        setRequiresServiceRole(true);
        setErrorMessage(json.error);
        setAccounts([]);
      } else if (json.success) {
        setRequiresServiceRole(false);
        setAccounts(json.data || []);
      } else {
        setErrorMessage(json.error || "Không thể tải danh sách tài khoản");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Lỗi kết nối API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  // Handle Create Account
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes("@")) {
      showToast("Vui lòng nhập địa chỉ email hợp lệ", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Mật khẩu khởi tạo phải từ 6 ký tự trở lên", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Mật khẩu xác nhận không trùng khớp", "error");
      return;
    }

    try {
      setCreateSubmitting(true);
      const res = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail.trim(),
          fullName: newName.trim() || "Quản trị viên",
          password: newPassword,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        showToast(json.error || "Không thể tạo tài khoản", "error");
        return;
      }

      showToast(
        "Đã tạo tài khoản quản trị thành công trên Supabase Auth!",
        "success",
      );
      setNewEmail("");
      setNewName("");
      setNewPassword("");
      setConfirmPassword("");
      setIsCreateModalOpen(false);
      loadAccounts();
    } catch (err: any) {
      showToast("Lỗi tạo tài khoản: " + err.message, "error");
    } finally {
      setCreateSubmitting(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;
    if (changePasswordVal.length < 6) {
      showToast("Mật khẩu mới phải từ 6 ký tự trở lên", "error");
      return;
    }
    if (changePasswordVal !== changeConfirmVal) {
      showToast("Mật khẩu xác nhận không trùng khớp", "error");
      return;
    }

    try {
      setPasswordSubmitting(true);
      const res = await fetch("/api/admin/accounts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          accountId: selectedAccount.id,
          newPassword: changePasswordVal,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        showToast(json.error || "Không thể đổi mật khẩu", "error");
        return;
      }

      showToast(
        `Đã đổi mật khẩu cho tài khoản "${selectedAccount.email}" thành công!`,
        "success",
      );
      setIsPasswordModalOpen(false);
      setSelectedAccount(null);
      setChangePasswordVal("");
      setChangeConfirmVal("");
    } catch (err: any) {
      showToast("Lỗi đổi mật khẩu: " + err.message, "error");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  // Handle Delete Account
  const handleDeleteAccount = async (acc: Account) => {
    if (!confirm(`Xác nhận xóa tài khoản "${acc.email}" khỏi Supabase Auth?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/accounts?id=${acc.id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok) {
        showToast(json.error || "Không thể xóa tài khoản", "error");
        return;
      }

      showToast(`Đã xóa tài khoản "${acc.email}" thành công`, "success");
      loadAccounts();
    } catch (err: any) {
      showToast("Lỗi xóa tài khoản: " + err.message, "error");
    }
  };

  // Filter accounts
  const filteredAccounts = accounts.filter(
    (a) =>
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header Section - Clean & Flat */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Quản lý tài khoản
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem danh sách tài khoản, tạo tài khoản và đổi mật khẩu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadAccounts}
            disabled={loading}
            className="px-3.5 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-60 inline-flex items-center gap-1.5"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin w-3.5 h-3.5 text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Đang tải...</span>
              </>
            ) : (
              "Làm mới"
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 rounded bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            + Thêm tài khoản mới
          </button>
        </div>
      </div>

      {/* 2. Notice if SUPABASE_SERVICE_ROLE_KEY is missing */}
      {requiresServiceRole && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-900 space-y-2">
          <div className="font-bold text-sm text-amber-950">
            Cần bổ sung biến môi trường SUPABASE_SERVICE_ROLE_KEY
          </div>
          <p>
            Để gọi trực tiếp <strong>Supabase Auth Admin API</strong> (truy xuất
            danh sách người dùng, tạo tài khoản tự động không cần email xác
            nhận, đổi mật khẩu và xóa user), bạn cần thêm biến bí mật{" "}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> vào tệp{" "}
            <code>.env.local</code>.
          </p>
          <div className="bg-white p-3 rounded border border-amber-200 font-mono text-[11px] text-slate-800">
            # Thêm vào .env.local:
            <br />
            SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi... (lấy tại Supabase Dashboard
            → Project Settings → API → service_role secret)
          </div>
        </div>
      )}

      {/* 3. Accounts Table */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
        {/* Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Tìm kiếm email, họ tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-slate-300 text-slate-900 text-xs rounded px-3 py-2 outline-none focus:border-slate-800"
            />
          </div>
          <span className="text-xs text-slate-500">
            Hiển thị <strong>{filteredAccounts.length}</strong> tài khoản
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3">Email đăng nhập</th>
                <th className="p-3">Tên quản trị viên</th>
                <th className="p-3">Vai trò</th>
                <th className="p-3">Ngày tạo</th>
                <th className="p-3">Lần đăng nhập cuối</th>
                <th className="p-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8">
                    <Loading
                      size="md"
                      text="Đang tải danh sách tài khoản..."
                      subtext="Đang kết nối Supabase Auth Admin"
                    />
                    <div className="mt-4">
                      <TableRowsSkeleton rows={3} />
                    </div>
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    {requiresServiceRole
                      ? "Chưa thể tải danh sách do chưa có SUPABASE_SERVICE_ROLE_KEY trong .env.local."
                      : "Không tìm thấy tài khoản nào."}
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">
                      {acc.email}
                    </td>

                    <td className="p-3 font-medium text-slate-800">
                      {acc.fullName}
                    </td>

                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                        Super Admin
                      </span>
                    </td>

                    <td className="p-3 text-slate-500">
                      {acc.createdAt
                        ? new Date(acc.createdAt).toLocaleDateString("vi-VN")
                        : "-"}
                    </td>

                    <td className="p-3 text-slate-500">
                      {acc.lastLoginAt ? (
                        <span>
                          {new Date(acc.lastLoginAt).toLocaleDateString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )}
                        </span>
                      ) : (
                        <span className="text-slate-400">Chưa ghi nhận</span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAccount(acc);
                            setChangePasswordVal("");
                            setChangeConfirmVal("");
                            setIsPasswordModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Đổi mật khẩu
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteAccount(acc)}
                          className="px-2.5 py-1 rounded bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Modal: Create new account */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full overflow-hidden border border-slate-300 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                Tạo tài khoản mới trên Supabase Auth
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email đăng nhập *
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@maikimtuyen.io.vn"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border border-slate-300 text-slate-900 text-xs rounded p-2 outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ tên / Tên quản trị viên *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-slate-300 text-slate-900 text-xs rounded p-2 outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu khởi tạo * (Tối thiểu 6 ký tự)
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-slate-300 text-slate-900 text-xs rounded p-2 outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Xác nhận mật khẩu *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-slate-300 text-slate-900 text-xs rounded p-2 outline-none focus:border-slate-800"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="px-4 py-1.5 rounded bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {createSubmitting ? "Đang tạo..." : "Tạo tài khoản"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Modal: Change password */}
      {isPasswordModalOpen && selectedAccount && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
          onClick={() => setIsPasswordModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full overflow-hidden border border-slate-300 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Đổi mật khẩu tài khoản
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tài khoản: <strong>{selectedAccount.email}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu mới * (Tối thiểu 6 ký tự)
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="••••••••"
                  value={changePasswordVal}
                  onChange={(e) => setChangePasswordVal(e.target.value)}
                  className="w-full border border-slate-300 text-slate-900 text-xs rounded p-2 outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Xác nhận mật khẩu mới *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={changeConfirmVal}
                  onChange={(e) => setChangeConfirmVal(e.target.value)}
                  className="w-full border border-slate-300 text-slate-900 text-xs rounded p-2 outline-none focus:border-slate-800"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="px-4 py-1.5 rounded bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {passwordSubmitting ? "Đang lưu..." : "Lưu mật khẩu mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
