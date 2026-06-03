type MaybeModel<T> = T & {
  get?: (options?: { plain?: boolean }) => Record<string, unknown>;
};

export function sanitizeUser<T>(user: MaybeModel<T> | null | undefined) {
  if (!user) {
    return user;
  }

  const plainUser =
    typeof user.get === 'function' ? user.get({ plain: true }) : user;
  const { password, ...safeUser } = plainUser as Record<string, unknown>;

  return safeUser;
}
